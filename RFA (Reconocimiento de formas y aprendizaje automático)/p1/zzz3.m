#!/usr/bin/octave -qf
load("OCR_14x14"); load("percep_w"); [N,L]=size(data); D=L-1;
for n=1:N; xn=[1 data(n,1:D)]';
for c=0:9 printf("g_%d(x_%d)=%.0f ",c,n,w(:,c+1)'*xn); end
printf("\n"); end
