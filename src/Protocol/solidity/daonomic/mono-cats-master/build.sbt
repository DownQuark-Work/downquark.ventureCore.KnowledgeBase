name := "mono"
version := "0.1.0"
scalaVersion := "2.12.5"

bintrayOrganization := Some("daonomic")
bintrayPackage := "mono-cats"
bintrayPackageLabels := Seq("mono", "cats", "daonomic", "reactive", "reactor", "projectreactor")
licenses += ("MIT", url("http://opensource.org/licenses/MIT"))
organization := "io.daonomic.cats"

libraryDependencies += "io.projectreactor" % "reactor-core" % "3.1.5.RELEASE"
libraryDependencies += "org.typelevel" %% "cats-core" % "1.1.0"
