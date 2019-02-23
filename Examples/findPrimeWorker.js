function findPrime(msg){
/*
	var i=0;
	while(true){
	i+=1;
	self.postMessage(i);
		setTimeout("timedCount()",500);
	}
*/
	var n = 1;
	search: while (n<=10000000){
	  n += 1;
		for (var i = 2; i <= Math.sqrt(n); i += 1)
		if (n % i == 0)
		 continue search;
	  // found a prime!
	  postMessage(n);
	}
}


self.addEventListener('message', findPrime);