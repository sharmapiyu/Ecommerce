#!/bin/sh
# Maven Wrapper script

set -e

MAVEN_PROJECTBASEDIR="${MAVEN_BASEDIR:-$(cd "$(dirname "$0")/.." && pwd)}"

MAVEN_OPTS="$(concat_lines "$MAVEN_OPTS")"

exec "$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar" "$@"
