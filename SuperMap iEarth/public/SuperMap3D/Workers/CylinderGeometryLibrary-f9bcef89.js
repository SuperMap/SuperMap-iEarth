define(["exports","./Math-5e067eb3"],(function(t,e){"use strict";var r={computePositions:function(t,r,n,o,a){var i,s=.5*t,c=-s,u=o+o,f=new Float64Array(3*(a?2*u:u)),h=0,v=0,M=a?3*u:0,p=a?3*(u+o):3*o;for(i=0;i<o;i++){var I=i/o*e.e.TWO_PI,P=Math.cos(I),b=Math.sin(I),d=P*n,l=b*n,m=P*r,w=b*r;f[v+M]=d,f[v+M+1]=l,f[v+M+2]=c,f[v+p]=m,f[v+p+1]=w,f[v+p+2]=s,v+=3,a&&(f[h++]=d,f[h++]=l,f[h++]=c,f[h++]=m,f[h++]=w,f[h++]=s)}return f}};t.I=r}));