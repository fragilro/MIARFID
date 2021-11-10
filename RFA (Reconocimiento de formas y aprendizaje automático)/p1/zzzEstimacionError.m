#!/usr/bin/octave -qf
load("OCR_14x14");
[N,L]=size(data); D=L-1;
ll=unique(data(:,L));
C=numel(ll); rand("seed",23);
data=data(randperm(N),:);
M=N-round(.7*N); te=data(N-M+1:N,:);
load("percep_w"); rl=zeros(M,1);
for m=1:M
  tem=[1 te(m,1:D)]';
  rl(m)=ll(linmach(w,tem)); end
[nerr m]=confus(te(:,L),rl)
