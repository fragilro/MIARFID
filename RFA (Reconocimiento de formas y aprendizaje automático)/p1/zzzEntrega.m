#!/usr/bin/octave -qf
load("news");
[w,E,k]=perceptron(data,1000,0.1); [E k]
save_precision(4);
save("news_w","w");
