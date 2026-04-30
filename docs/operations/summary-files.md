---
title: Summary files
description: "Configure RSJ to generate a summary file that extracts batch return codes from large job output files for easier analysis."
tags:
  - Procedural
  - Operations Staff
  - Agents
---

# Summary files

## What is it?

The summary file feature allows RSJ to scan a job's batch output file after the job completes and produce a condensed file that lists only the batch return codes and key processing messages. This makes it easier to analyze the results of jobs that produce very large batch output files — such as GOODNIGHT — without reviewing thousands of lines of output.

- Use summary files when a job produces batch output that is too large to review manually.
- Configure `SuppressZeroReturns` to further reduce the summary file to only non-zero (error) return codes.

## Configuration

To use the summary file feature, add the `-s` option to the RSJ command line, specifying the path to a summary configuration file.

:::tip Example

```
-s/SYM/SYM000/LETTERSPECS/GoodnightSummaryConfig
```

:::

:::info Note

The user running the job must have read access to the specified configuration file.

:::

The job output includes messages showing that summary file generation was specified.

## Summary file configuration file

The configuration file supports the following directives:

:::tip Example

```
#
SummaryFileName=/SYM/SYM000/LETTERSPECS/GoodnightSummary
SuppressZeroReturns=false
```

:::

:::info Note

The user running the job must have write and create access to the file specified by `SummaryFileName`.

:::

| Directive | Description |
| --------- | ----------- |
| `SummaryFileName` | The path and name of the summary file to create. |
| `SuppressZeroReturns` | Set to `true` to exclude `BATCHRETURNCODE` lines with a return code of `000` from the summary. Set to `false` to include all return codes. |

## Summary file output

After the job finishes, RSJ scans the batch output file and creates the summary file. Each line in the summary file shows the line number from the original batch output (in parentheses) and the corresponding `BATCHRETURNCODE` entry.

:::tip Example

```
Summary file for : GOODNIGHT
Completion Date : 03/25/2015
SYM : SYM000

(00041) %BATCHRETURNCODE: 000 Job successful from Program: BATCHHOSTCONTROL.
(00133) %BATCHRETURNCODE: 000 Job successful from Program: BATCHHOSTCONTROL.
(00172) %BATCHRETURNCODE: 000 Job successful from Program: CLOSEDAY.
(00192) %BATCHRETURNCODE: 000 Job successful from Program: REPWRITER.
(SMA_DATES.RG)
(00236) %BATCHRETURNCODE: 000 Job successful from Program: REPWRITER.
(RB.DELETE.REPORTS)
(00277) %BATCHRETURNCODE: 000 Job successful from Program: BATCHHOSTCONTROL.
```

:::

When `SuppressZeroReturns` is set to `true`, only non-zero return codes appear in the summary file:

:::tip Example

```
Summary file for : GOODNIGHT
Completion Date : 03/25/2015
SYM : SYM000
```

:::

:::info Note

Errors in configuration, access permissions, or file creation do not cause the RSJ job to fail. Any errors are logged in the job output, and the summary file is not created.

:::
