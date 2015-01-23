(ns now.rand
  (:require [cemerick.pprng :as rng])
  (:gen-class))

(def IM 2147483647)

(defn get-int [seed]
  (let [r (java.util.Random. seed)]
    (.nextInt r IM)))

(defn get-exp-int [seed gap]
  (Math/abs
    (* -1 gap 
       (Math/log (get-int seed)))))
