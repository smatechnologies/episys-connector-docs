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

## Workaround for OpCon versions before 4.0

:::note

This workaround applies only to OpCon versions before 4.0. OpCon 4.0 and later do not require this workaround. If you are running a current version of OpCon, you can ignore this section.

:::

Versions of OpCon before 4.0 contain a bug that prevents users from viewing all job output from Symitar jobs. Most jobs display without issue, but jobs with very large output files (such as GOODNIGHT) may exceed the maximum viewable limit. To work around this issue, create a shell script:

```bash
cat "/ops/bin/RSJ 0 GOODNIGHT|tee /tmp/GOODNIGHT.OUT" >/tmp/GOODNIGHT.KSH
chmod ugo+x /tmp/GOODNIGHT.KSH
```

In the start image line in OpCon, use: `/bin/ksh /tmp/GOODNIGHT.KSH`

When the job runs, the output is copied to `/tmp/GOODNIGHT.OUT` and `STDOUT`. Use a text editor such as `vi` to view the output.
