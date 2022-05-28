# Installation

## Requirements

Before beginning the installation, ensure that the system requirements are met. RSJ must be run through a UNIX LSAM on the Episys server. For more information, refer to UNIX LSAM Installation in the UNIX LSAM online help. 

When you configure the UNIX LSAM to run, you must leave the path_to_su value set to no. For more information, refer to LSAM Configuration Parameters in the UNIX LSAM online help.

Place RSJ tar file on Machine with Episys and a UNIX LSAM

Copy the tar file from the OpCon distribution directory, ```<media>:\Install\LSAM\RSJ```, to the machine for FTP.
FTP the RSJ tar file (e.g., RSJ_1_30_0012.tar) to the AIX machine in binary mode.

## Installation

To install RSJ on a UNIX system, complete either the new installation or upgrade installation procedure in this section depending on which type is required.

### New Installation

1. From the Episys Interface, click the Log off button.
2. From the $ prompt, issue the following commands:
* ```su```
* enter the root password
3. Create the RSJ directory and move RSJ in place. Issue the following commands:
* ```mkdir /ops```
* ```cd /ops```
* ```mkdir bin```
* ```cd bin```
* ```mv /SYM/SYMnnn/LETTERSPECS/RSJ<version>.tar /ops/bin/RSJ<version>.tar```
4. Untar the ```RSJ<version>.tar```. In ```/ops/bin```, issue the following command:
```tar -xvf RSJ<version>.tar```

### Upgrade Installation

1. From the Episys Interface, click the Log off button.
2. From the $ prompt, issue the following commands:
* ```su```
* enter the root password
* ```cd /ops/bin```
* ```mv /SYM/SYMxxx/LETTERSPECS/RSJ<version>.tar /ops/bin/RSJ<version>.tar```
3. Untar the ```RSJ<version>.tar```. In /ops/bin, issue the following command:
```tar -xvf RSJ<version>.tar```

### Set Up SMA_DATES.JOB

Each SYM in Episys could be on a different system date. RSJ must know the system date for a given SYM to accurately account for match dates within the Episys job it is running. The SMA_DATES.JOB creates an SMA_DATES Letter File with the current system date of the specified SYM. This Letter File is read by RSJ and is used to determine which match dates to abide by. The SMA_DATES.JOB and all of its components are installed using the install_dates program.

:::warning

When the install_dates program is run, the sma_dates.job job file, sma_dates letter file, and the sma_dates.rg are created for every sym. The sma_dates.job is also inserted below the closeday program in every job file which contains the closeday program (before doing so a backup of the job is created with a "_pre.sma" extension added to the end of the file). The sma_dates.job is also added into all jobs which contain the closeday job file.

:::

### Run the install_dates Program

1. Log in to Episys.
2. From the dollar sign, issue the following commands:
* ```su```
* enter root password
* ```cd /ops/bin```
3. Run the install_dates program.

:::tip Example

```./install_dates sym_number```

- or -

```./install_dates 000```

:::

4. Run the ```SMA_DATES.JOB``` in Episys for every SYM OpCon will be run in.

:::warning

This file must be updated immediately after any date change or use of the install_dates program. Failure to properly install/run sma_dates will cause RSJ to run incorrectly.

:::