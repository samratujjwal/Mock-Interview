# Resume Service

PDF resume extraction, skill detection, project extraction, and experience profiling.

This service currently supports resume metadata persistence, PDF upload storage, and asynchronous resume parsing. The parsing endpoint is designed to be idempotent and rerunnable, and it persists parsed text with status tracking for later AI extraction.

The resume extraction service uses AI to analyze parsed resume text and extract structured entities such as skills, projects, experience, education, certifications, and summary. It stores normalized extracted data on the resume document and tracks extraction status and errors.
