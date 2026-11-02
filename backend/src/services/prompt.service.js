import {
  getPromptTemplate,
  getPromptMetadata,
  getPromptVersions,
  getPromptKeys,
} from '../prompts/index.js';

const PLACEHOLDER_REGEX = /{{\s*([\w.]+)\s*}}/g;

function getNestedValue(object, path) {
  if (!object || !path) return undefined;
  return String(path || '').split('.').reduce((current, key) => {
    if (current == null || typeof current !== 'object') return undefined;
    return current[key];
  }, object);
}

function renderTemplate(template, values = {}) {
  if (typeof template !== 'string') return '';

  return template.replace(PLACEHOLDER_REGEX, (_, fieldName) => {
    const value = getNestedValue(values, fieldName);
    if (value == null) return '';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch (err) {
        return String(value);
      }
    }
    return String(value);
  });
}

export class PromptService {
  constructor() {
    this.registry = {
      getPromptTemplate,
      getPromptMetadata,
      getPromptVersions,
      getPromptKeys,
    };
  }

  listKeys() {
    return this.registry.getPromptKeys();
  }

  listVersions(key) {
    return this.registry.getPromptVersions(key);
  }

  getTemplate(key, version) {
    return this.registry.getPromptTemplate(key, version);
  }

  renderPrompt({ key, version, values = {} } = {}) {
    const template = this.getTemplate(key, version);
    if (!template) {
      throw new Error(`Prompt template not found for key='${key}' version='${version || 'latest'}'`);
    }
    return renderTemplate(template.prompt, values);
  }

  getMetadata(key, version) {
    return this.registry.getPromptMetadata(key, version);
  }
}

export const promptService = new PromptService();
