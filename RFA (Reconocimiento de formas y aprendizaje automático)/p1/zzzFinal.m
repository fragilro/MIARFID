#!/usr/bin/octave -qf
load("news"); [N,L]=size(data); D=L-1;
ll=unique(data(:,L)); C=numel(ll);
rand("seed",23); data=data(randperm(N),:);
NTr=round(.7*N); M=N-NTr; te=data(NTr+1:N,:);
printf("#      a      b    E   k  Ete   m                I\n");
printf("#------- -------  --- --- --- -----  -------------\n");
for b=[1000 100 10 1 10000]
  for a=[.1]
    [w,E,k]=perceptron(data(1:NTr,:),b,a); rl=zeros(M,1);
    for n=1:M rl(n)=ll(linmach(w,[1 te(n,1:D)]')); end
    [nerr m]=confus(te(:,L),rl);
    m=nerr/M;
    s=sqrt(m*(1-m)/M);
    r=1.96*s;
    printf("%8.1f %8.1f %3d %3d %3d %.3f [%.3f , %.3f]\n",a,b,E,k,nerr,m, m-r,m+r);
  end
end
