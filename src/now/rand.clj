(ns now.rand
  (:gen-class))

(def IM 2147483647)

(defn step-1 [seed]
        (rand-int IM))

(defn step-2 [seed]
        (/ (step-1 seed) IM))

(defn get-int [seed]
  (step-2 seed))

(defn get-exp-int [seed gap]
             (* -1 gap (Math/log (get-int seed))))
