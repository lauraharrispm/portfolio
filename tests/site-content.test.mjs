import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const modules = new Map();
function load(file) {
  if (modules.has(file)) return modules.get(file);
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(output, {
    module: loaded,
    exports: loaded.exports,
    require: (specifier) => {
      assert.ok(specifier.startsWith("@/"), `Unexpected import: ${specifier}`);
      return load(`src/${specifier.slice(2)}.ts`);
    },
  });
  modules.set(file, loaded.exports);
  return loaded.exports;
}

const { projects } = load("src/content/projects.ts");
const { CASE_STUDY_SLUGS } = load("src/content/chat/config.ts");

test("published studies follow the requested order with both fractional studies first", () => {
  assert.deepEqual(Array.from(projects, (project) => project.id), [
    "patient-intake",
    "patient-portal",
    "payments-onboarding",
    "annual-plans",
    "phone-agent-tool",
    "therapist-directory",
  ]);
  assert.equal(projects[0].engagement, "Fractional");
  assert.equal(projects[1].engagement, "Fractional");
  for (const project of projects) {
    if (project.crossLink) {
      assert.ok(projects.some((other) => other.id === project.crossLink.toId));
    }
  }
});

test("chat's published links and knowledge agree with the visible studies", () => {
  assert.deepEqual(
    Object.values(CASE_STUDY_SLUGS).sort(),
    Array.from(projects, (project) => project.id).sort(),
  );
  const knowledge = fs.readFileSync("src/content/chat/knowledge.md", "utf8");
  const published = knowledge.split("\n").find((line) =>
    line.startsWith("These are the case studies published on the site"),
  ).toLowerCase();
  let lastIndex = -1;
  for (const project of projects) {
    const index = published.indexOf(project.title.toLowerCase());
    assert.ok(index > lastIndex, `Missing or out-of-order study: ${project.title}`);
    lastIndex = index;
  }
});

test("a parent portal question produces a link to the restored portal story", () => {
  const { mockRespond } = load("src/lib/chat/mock.ts");
  const { computeChips } = load("src/lib/chat/followups.ts");
  const question = "Tell me about the fractional parent portal project.";
  const response = mockRespond(question);
  assert.ok(response.sources.includes("case_patient_portal"));
  const chips = computeChips({
    modelFollowups: response.followups,
    sources: response.sources,
    intent: response.intent,
    askedQuestions: [question],
    touchedTopics: new Set(response.sources),
    visitorMessageCount: 1,
  });
  assert.ok(chips.some((chip) =>
    chip.kind === "case_study" && chip.href === "#work-patient-portal",
  ));
});
