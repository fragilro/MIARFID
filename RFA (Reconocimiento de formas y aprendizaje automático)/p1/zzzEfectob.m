#!/usr/bin/octave -qf
load("OCR_14x14"); [N,L]=size(data); D=L-1;
ll=unique(data(:,L)); C=numel(ll);
rand("seed",23); data=data(randperm(N),:);
NTr=round(.7*N); M=N-NTr; te=data(NTr+1:N,:);
printf("#      b   E   k Ete\n");
printf("#------- --- --- ---\n");
for b=[.1 1 10 100 1000 10000 100000]
  [w,E,k]=perceptron(data(1:NTr,:),b); rl=zeros(M,1);
  for n=1:M rl(n)=ll(linmach(w,[1 te(n,1:D)]')); end
  [nerr m]=confus(te(:,L),rl);
  printf("%8.1f %3d %3d %3d\n",b,E,k,nerr);
end


for b=[.1 1 10 100 1000 10000 100000]
  for a=[.1 1 10 100 1000 10000 100000]


  for b=[1000 5000 5000 10000 10000 50000 50000 100000 100000]
    for a=[.1 .5 1 0.5 1 5 10 5 10]

VIDEOS
for b=[0.1 1 10 100 1000]
  for a=[10 100 1000 10000 100000]

NEWS
alpha 0.1 b cuanto más mejor
