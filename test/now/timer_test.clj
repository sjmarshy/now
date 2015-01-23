(ns now.timer-test
  (:use clojure.test))

(require '[now.timer :as t])

(def fifth-tick 1406339578)
(def average-gap 20)

(deftest predictable-ticks
  (is (= (nth (t/get-infinite-ticks t/magic-seed average-gap) 5))))
