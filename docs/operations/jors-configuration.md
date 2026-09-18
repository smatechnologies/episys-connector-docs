---
title: JORS configuration
description: "Configure the SQL Server max text repl size parameter to allow OpCon to store and display full Symitar job output through JORS."
tags:
  - Procedural
  - System Administrator
  - Agents
---

# JORS configuration

## What is it?

JORS (Job Output Retrieval System) allows OpCon to retrieve and display the output of Symitar batch jobs run through RSJ. The SQL Server configuration parameter `max text repl size` limits the maximum size of job output that OpCon can accept and store in its database. For jobs that produce large output files (such as GOODNIGHT), the default limit of 65,536 characters may not be sufficient.

- Configure this setting when job output is being truncated in the OpCon interface.
- Increase the value if large Symitar jobs such as GOODNIGHT exceed the viewable limit.

## Configuration

To increase the maximum job output size that OpCon can store, run the following SQL command against the OpCon database:

:::tip Example

```sql
sp_configure 'max text repl size','600000'
RECONFIGURE
```

:::

The maximum value for this configuration parameter is `2147483647`.

## When output is missing rather than truncated

`max text repl size` governs how much output OpCon can store, so raising it resolves output that is
cut short. It does not help when there is no output at all.

If JORS shows nothing for a job, check whether the job was started with the `-b` flag. That flag
suppresses the batch output upload, so the output is not retrievable through JORS after the job
completes. See [Command line](./command-line.md) for the full option list.

## FAQs

**Job output is truncated in OpCon. What do I change?**
Increase `max text repl size` on the OpCon database, as shown above. The default of 65,536 characters
is too small for large jobs such as GOODNIGHT.

**JORS shows no output at all for a job. Is this the same setting?**
No. Check for the `-b` flag on the RSJ command line first — it suppresses the output upload
entirely.

**What is the largest value I can set?**
`2147483647`.

## Related topics

- [Command line](./command-line.md)
- [RSJ reports](../rsj-reports.md)

