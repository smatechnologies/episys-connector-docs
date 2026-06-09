---
title: RSJ failover
description: "Configure RSJ and OpCon to work correctly with the Symitar FAILOVER system when swapping primary and secondary Episys servers."
tags:
  - Conceptual
  - System Administrator
  - Agents
---

# RSJ failover

## What is it?

The Symitar FAILOVER system allows you to swap a primary and secondary machine when the primary becomes unavailable. RSJ and OpCon are not required to use the FAILOVER system, but when it is configured, specific steps must be followed to ensure RSJ continues to run correctly after a failover event.

- Use this guidance when your site has implemented the Symitar FAILOVER system and needs to ensure RSJ and OpCon schedules are correctly managed during a failover.
- Review the FAILOVER configuration requirements before enabling automated FAILOVERD, as SMA Technologies recommends manual failover execution to avoid undetected switchovers in OpCon.

## FAILOVER configuration requirements

RSJ and OpCon do not require either the FAILOVER macro or the FAILOVERD daemon to be running or configured. If you want to configure one or both, you must implement the complete FAILOVER system as described in the Symitar document "Episys Failover System Implementation — A technical discussion for implementing the Episys Failover System for disaster preparedness 10Nov02." This document is available on the Symitar website. Contact Symitar for assistance in configuring your FAILOVER systems.

:::warning

Failure to fully configure the FAILOVER systems causes RSJ not to run.

:::

## OpCon schedule management

When running a failover, complete the following steps in OpCon before running the FAILOVER macro:

1. Bring down the Symitar server in OpCon.
2. At a minimum, place all schedules for the Symitar machine on hold.

These steps prevent OpCon from inadvertently running jobs on the wrong machine after the FAILOVER macro completes.

You are responsible for ensuring that OpCon does not run jobs on the wrong machine once the FAILOVER macro has run. Place all schedules on hold until you have determined exactly which jobs need to run or be re-run.

## Interrupted jobs

Consider what happens when a program or a sequence of programs is interrupted by the FAILOVER macro. In the worst case, OpCon has just sent a job or series of jobs to the primary machine when the FAILOVER macro runs.

You must also consider which programs were not run on the secondary machine. You may need to re-run multiple jobs and schedules.

## FAILOVERD recommendation

SMA Technologies recommends that FAILOVERD not be configured to run automatically. Run FAILOVERD manually instead, since there is no notification facility to OpCon that the primary machine has been replaced with the secondary machine. Running FAILOVERD automatically can result in OpCon continuing to send jobs to what was the primary machine without any awareness of the switchover.

## Administration

**Managing OpCon machine records after failover:**
After a failover event, the secondary server takes on the role of the primary. Update the OpCon UNIX machine record to point to the new active server's hostname or IP address. Without this update, OpCon continues to submit jobs to the previous primary server address. Reverse this update when the original primary is restored.

**Returning to normal after failover:**
When the original primary server is restored, run the FAILOVER macro in reverse to swap back. Before doing so, repeat the OpCon schedule hold steps to prevent jobs from running on the wrong machine during the swap. Update the OpCon machine record again after the swap completes.

## Security considerations

**Credentials and encrypted files are not replicated automatically.**
If you use `ExecuteAsRoot`, the `rootInfo` file in `/ops/bin/` contains encrypted root credentials. Verify that this file is present and current on both the primary and secondary servers.

## Glossary

**FAILOVER** — The Symitar macro that swaps the primary and secondary Episys servers during a disaster recovery event.

**FAILOVERD** — The Symitar daemon that can trigger the FAILOVER macro automatically. SMA Technologies recommends running this manually rather than automatically.

**Primary server** — The active Episys server under normal operating conditions.

**Secondary server** — The standby Episys server that becomes active after a FAILOVER event.
