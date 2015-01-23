(ns now.timer
  (:require [clojure.core.async :as async]
            [now.rand :as r])
  (:gen-class))

(def magic-seed 1406331136)
(def default-delay 1)


(defn next-tick-interval
  [last-tick average-delay]
  (* 60 (r/get-exp-int last-tick average-delay)))

(defn next-tick
  [last-tick average-delay]
  (+ last-tick (int (next-tick-interval last-tick average-delay))))

(defn current-time
  []
  (quot (System/currentTimeMillis) 1000))

(defn get-infinite-ticks
  [first-tick average-delay]
  (let [next (next-tick first-tick average-delay)]
    (cons next (lazy-seq (get-infinite-ticks next average-delay)))))

(def ticks (get-infinite-ticks magic-seed default-delay))

(defn get-interval-between-ticks [x y]
  (- (nth ticks x) (nth ticks y)))

(defn print-intervals []
  (loop [x 2 y 1]
    (println (get-interval-between-ticks x y))
    (recur (inc x) (inc y))))

(defn get-last-tick
  [ticks now]
  (loop [tick (first ticks) tick2 (second ticks) r (rest ticks)]
    (if (> tick2 now)
      tick
      (recur (first r) (second r) (rest r)))))

(defn get-next-tick
  [ticks now]
  (loop [tick (first ticks) r (rest ticks)]
    (if (> tick now)
      tick
      (recur (first r) (rest r)))))

(defn tick-channel
  [ticks]
  (let [c (async/chan) ]
    (async/go-loop [next-tick (get-next-tick ticks (current-time)) now (current-time)]
                   (if (< next-tick now)
                     (do
                       (async/>! c next-tick)
                       (recur (get-next-tick ticks now) (current-time)))
                     (let [t (async/timeout 1000)]
                       (async/<!! t)
                       (recur next-tick (current-time)))))
    c))
