(ns now.core
  (:require [now.timer :as t]
            [now.edit :as edit]
            [clj-statsd :as statsd]
            [clojure.core.async :as async :refer [<!! <! go]])
  (:import (ec.util))
  (:gen-class))

(defn blocking-get [channel]
  (<!! (go (<! channel))))

(defn -main [& args]
  (statsd/setup "37.59.119.1" 8125)
  (let [start (t/current-time)
        c (t/tick-channel t/ticks)]
    (loop [tick (blocking-get c) l start]
      (statsd/timing "now.debug.tick.interval" (- tick l))
      (let [in (edit/launch tick)]
        (println (blocking-get in)))
      (recur (blocking-get c) tick))))
