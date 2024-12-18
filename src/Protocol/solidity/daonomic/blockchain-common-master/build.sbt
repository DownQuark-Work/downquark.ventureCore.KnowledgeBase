name := "blockchain-common"

def base(project: Project): Project = project.settings(
  organization := "io.daonomic.blockchain",
  bintrayOrganization := Some("daonomic"),
  bintrayPackageLabels := Seq("daonomic", "blockchain", "listener", "bitcoin", "ethereum"),
  licenses += ("MIT", url("http://opensource.org/licenses/MIT")),
  version := "0.1.3",
  scalaVersion := Versions.scala
)

def common(project: Project): Project = tests(base(project))

def tests(project: Project): Project = project
  .settings(libraryDependencies += "org.scalatest" %% "scalatest" % Versions.scalatest % "test")
  .settings(libraryDependencies += "org.scalacheck" %% "scalacheck" % Versions.scalacheck % "test")
  .settings(libraryDependencies += "org.mockito" % "mockito-all" % Versions.mockito)

lazy val listener = common(project)
  .dependsOn(poller)

lazy val `listener-mono` = common(project)
  .dependsOn(listener)
  .dependsOn(`poller-mono`)

lazy val poller = common(project)

lazy val `poller-mono` = common(project)
  .dependsOn(poller)

lazy val root = base(project in file("."))
  .settings(publish := {})
  .aggregate(listener, `listener-mono`, poller, `poller-mono`)
