---
title: RSJ reports
description: "Understand how RSJ organizes and names Symitar report files in the opcon_reports directory, including batch output files and report sequence numbers."
tags:
  - Conceptual
  - Operations Staff
  - Agents
---

# RSJ reports

## What is it?

When a Symitar batch job runs through RSJ, RSJ creates a dedicated directory under `opcon_reports` for that job and stores all batch output files and report file links produced by the job. This organization makes it easy to retrieve, archive, and analyze job output.

- Use the `opcon_reports` directory to locate batch output files and linked report files for any job that ran through RSJ.
- Use the batch output file to cross-reference report sequence numbers with report titles.
- Create OpCon jobs to archive and clean the `opcon_reports` directory on a regular schedule.

## OpCon reports directory

The `opcon_reports` directory is only available from SMA Technologies. Symitar does not support the `opcon_reports` directory.

After a job runs through RSJ, RSJ creates a directory in the following location:

```
/SYM/SYMnnn/opcon_reports/jobfile
```

where `jobfile` is the name of the job file that was run. Each batch output file and report file created by the job is stored in this directory.

To maintain the `opcon_reports` directories:

- Create an OpCon job to tar/zip the directory and move the archive to another directory. This lets you review what succeeded or failed on any given day.
- Create a second OpCon job to clean the directory every morning.

Links to the sequence number reports in the `REPORT` directory are created in the nested job file directory under `opcon_reports`. Using links is more efficient than creating copies of each report.

## RSJ report naming

When Symitar jobs run, the reports they create are placed in `/SYM/SYM###/REPORT` (where `###` is the three-digit SYM number). Each report file is named as a six-digit number.

One report file serves as the cross-reference between these sequence numbers and the report titles (along with other information). This cross-reference report is the batch output file.

:::info Note

The batch output file is the cross-reference between report sequence numbers and report titles. For normal jobs, the batch output file is approximately 2,000 lines long. For complex jobs, it can exceed 10,000 lines.

:::

## FAQs

**Where are RSJ report files stored?**
After a job runs through RSJ, all batch output files and report links are stored in `/SYM/SYMnnn/opcon_reports/jobfile`, where `jobfile` is the name of the job that was run.

**How do I find the sequence number for a specific report?**
Search the batch output file for the report title. The batch output file contains cross-reference entries that map each sequence number to its report title. You can also use the `LookForReportInRSJ` utility to find the sequence number automatically. See [RSJ utility programs](rsj-utility-programs.md).

**How do I archive or clean the opcon_reports directory?**
Create OpCon jobs that run the `backup_and_prune` utility program. SMA Technologies recommends running this nightly. See [RSJ utility programs](rsj-utility-programs.md) for usage details.
