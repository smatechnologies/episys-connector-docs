---
title: Commonly used terms
description: "Glossary of terms commonly used in Episys credit union processing and RSJ automation."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Commonly used terms

## What is it?

This page defines terms commonly used in Episys credit union processing and RSJ automation. Use this glossary as a reference when reviewing documentation or configuring RSJ jobs.

## Glossary

**ACH** (Automated Clearing House) — Every 24 hours, the Federal Reserve Bank in Atlanta creates four files for download that contain money transfers. This includes credits and debits to each member's account.

**CUSC** (Credit Union Service Corporation) — A commonly used vendor that provides support for "sharing," also called "shared branch" (providing services at multiple locations).

**GOODNIGHT** — The nightly processing batch job that closes the processing day. It typically runs `CLOSEDAY` and associated repgen reports.

**OFAC** (Office of Foreign Assets Control) — At irregular periods, a file is received from OFAC that credit unions use to help enforce economic and trade sanctions based on US foreign policy and national security goals against targeted foreign countries, terrorists, international narcotics traffickers, and those engaged in activities related to the proliferation of weapons of mass destruction.

**OpCon** — The SMA Technologies workload automation platform that schedules and controls RSJ and other jobs on Episys and other systems.

**RSJ** (Remote Symitar Job) — The SMA Technologies program installed on the Episys server that runs Symitar batch jobs under OpCon control, with error checking and report management.

**SAJ** (Split and Join) — A separately licensed SMA Technologies wrapper around RSJ that supports parallel job execution using `%SPLIT` and `%JOIN` directives.

**SYM** — A logical credit union instance within the Episys platform. Identified by a three-digit number (for example, SYM000).

**Symitar** — The core banking platform developed by Jack Henry & Associates (formerly Symitar Systems) used by credit unions. Episys is the primary Symitar product.
