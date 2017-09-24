# show

Display the environment.

## Usage

    mlproj show

## Description

This command displays the details of an environment.  The environment is
"resolved" before being displayed (variables, dependencies are resolved,
parameters are injected.)

You can use it to ensure that what you put in your environment files gets
interpreted as expected by `mlproj`.  Or to make sure you are going to create
the components you need before using `mlproj setup`.
