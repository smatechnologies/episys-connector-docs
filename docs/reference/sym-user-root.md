# Running RSJ as SYM User and Elevating to Root

## Running RSJ as a SYM User

### Introduction
It has been requested that security be increased by not allowing jobs to be executed under the root security context. It should be noted that while RSJ was defined in the Enterprise Manager to run as root and it started up as root, it quickly changed user to the SYM user. However, it is more desirable to not have root jobs defined in OpCon. These steps detail how to configure the system to do this.

### Agent (LSAM)

#### Configure the Agent

1. In ```$LSAM_ROOT/config/<socket>/lsam.conf```, set: ```path_to_su```to ```no```
2. Stop and restart the agent.

### RSJ Installation
This will need to be done while logged in as the root user. If the directories already exist, verify that the permissions are set correctly.

#### Configure RSJ Installation

1. Create the required directories by entering:
    * ```mkdir /ops```
    * ```mkdir /ops/bin```
    * ```mkdir /ops/bin/args```
    * ```mkdir /ops/bin/cancel```
    * ```mkdir /tmp/SMA```
2. FTP or copy the RSJ tarfile to /ops/bin.
3. Extract the tarfile, by entering the following:
    * ```cd /ops/bin```
    * ```tar xvf *.tar```
4. Set the correct directory permissions by entering:
    * ```chmod –R 777 /ops```
    * ```chmod 775 /ops/bin/*```
    * ```chmod 777 /ops/bin/args```
    * ```chmod 777 /ops/bin/cancel```
    * ```chmod 777 /tmp/SMA```

## Temporarily Raising Permissions to Root

### Introduction

With Service Pack 3 of the latest version of Episys, Symitar has modified the SYSTEMBACKUP script to include a command (```cfgmgr```) that can ONLY be executed by root (or by a user in the system group). This means that this one job MUST be executed as the root user. (There may be additional jobs that fall into this category as well.) RSJ now has a facility that will allow a Symitar batch job to be executed as root and then return to the SYM user. To avoid opening additional security holes, there are significant limitations that have been imposed. For example, consider the following (VERY simple) GOODNIGHT:

```
%JOBFILE OFFLINE

%JOBFILE BACKUPSYM000TOSYM001

%JOBFILE CLOSEDAY

%JOBFILE SMA_DATES.JOB

%JOBFILE DELETE_REPORTS

%JOBFILE ONLINE
```

The only job that must run as the root user is ```BACKUPSYM000TOSYM001```. The other jobs should run as the SYM user. Once the RSJ connector is installed and the root Information file has been created, the permissions of this job can be elevated to root by adding the ```;ExecuteAsRoot``` directive immediately before the job. This makes the job batch file look like:

```
%JOBFILE OFFLINE

;ExecuteAsRoot

%JOBFILE BACKUPSYM000TOSYM001

%JOBFILE CLOSEDAY

%JOBFILE SMA_DATES.JOB

%JOBFILE DELETE_REPORTS

%JOBFILE ONLINE
```

### Create Root Information File

1. Change directories to /ops/bin. Examine the file rootInfo. The default values are:

```
rootPromptCharacter=#

pathToExpect=/usr/bin/expect

pathTosu=/usr/bin/su

pathToEnvironment=/SYM/OP/bin/LOGON
```

* Ensure that these values are correct. (Do a ```su – root``` to verify the root prompt character. The default prompt string is ```<hostname> #```. We only need to specify the ending #. There may or may not be an environment file ```/SYM/OP/bin/LOGON```. Symitar states (in the .profile file that is in root's home directory) that ```/SYM/OP/bin/LOGON``` is the location for local environment variables. We will need to ensure that any environment variables required by cfgmgr are defined.

2. Once these values are correct, execute EncryptRootInfo. You WILL be prompted for the root password. EncryptRootInfo will create an encrypted file called rootInfo.encrypted.

3. Complete the set-up process by executing the following commands:

```
cp ExecuteAsRoot /SYM/<SYM#>/BATCH/ExecuteAsRoot

chgrp <SYM#> /SYM/<SYM#>/BATCH/ExecuteAsRoot

chown <SYM#> /SYM/<SYM#>/BATCH/ExecuteAsRoot

chmod 700 /SYM/<SYM#>/BATCH/ExecuteAsRoot
```

:::tip Example

To set up SYM000, these command would look like:

cp ExecuteAsRoot /SYM/SYM000/BATCH/ExecuteAsRoot

chgrp SYM000 /SYM/SYM000/BATCH/ExecuteAsRoot

chown SYM000 /SYM/SYM000/BATCH/ExecuteAsRoot

chmod 700 /SYM/SYM000/BATCH/ExecuteAsRoot

:::

:::info Note

With SP3 release of Episys 16, the script ```/SYM/MACROS/SYSTEMBACKUP``` was rewritten to include the chgmgr command. This is why the ability to execute a batch file as root was added. However, an environment variable (```ODMDIR```) is also required.

:::

### Include the Environment Variable

1. Log on as root and enter "env". See what the value is for ```ODMDIR```. (The value on the machine at SMA Technologies is ```/etc/objrepos```).
2. Create a file named ```/SYM/OP/bin/LOGON``` (if it doesn't exist). In this file, add the line:
```export ODMDIR=<value found in 1st step>```

* If the directory ```/SYM/OP/bin``` does not exist, you can create it by executing the following lines:

```
mkdir /SYM/OP/bin

chmod 777 /SYM/OP/bin
```

* Then, you can create the file by executing:

```echo "export ODMDIR=/etc/objrepos" > /SYM/OP/bin/LOGON```

3. Edit ```/ops/bin/rootInfo``` and change the setting of pathToEnvironment to:```/SYM/OP/bin/LOGON```

4. Change directories to ```/ops/bin``` and execute EncryptRootInfo.

### Limitations

* The ```;script``` feature will not execute ExecuteAsRoot. This is to prevent malicious use of ExecuteAsRoot.
* If a job has been elevated to root permission, all ```;script``` specifications encountered within the job (or sub-jobs) will be executed as the SYM user, not as root.
* The application ExecuteAsRoot can only be driven by RSJ through the SMA Technologies agent.
* The application ExecuteAsRoot cannot be renamed.
