(defproject now "0.1.0-SNAPSHOT"
  :description "bugging you about what you're doing since 1406331136"
  :url "https://github.com/sjmarshy/now"
  :license {:name "MIT"}
  :dependencies [[org.clojure/clojure "1.6.0"]]
  :main now.core
  :target-path "target/%s"
  :profiles { :uberjar {:aot :all}})
