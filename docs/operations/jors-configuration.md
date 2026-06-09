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

