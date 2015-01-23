(defproject now "0.1.0-SNAPSHOT"
  :description "bugging you about what you're doing since 1406331136"
  :url "https://github.com/sjmarshy/now"
  :license {:name "MIT"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [me.raynes/conch "0.8.0"]
                 [org.clojure/java.jdbc "0.3.6"]
                 [org.xerial/sqlite-jdbc "3.7.15-M1"]
                 [korma "0.4.0"]]
  :source-paths ["./vendor/clj-statsd/src" "src"]
  :main now.core
  :target-path "target/%s"
  :profiles { :uberjar {:aot :all}})
