/*
Results (Apple M2)
------------------
 173.66M 1768.88ms
  43.42M 469.78ms
   6.95M 93.15ms
   1.74M 33.02ms
 445.34K 15.39ms
 */

import sharp from "sharp";
import fs from "fs";
import { performance } from "perf_hooks";

(async function main() {
	const imgs = ["10_000.png", "5_000.png", "2_000.png", "1_000.png", "500.png"];
	const outsize = 300;

	for (const img of imgs) {
		const buf = fs.readFileSync(img);
		const iterations = 100;
		const times = [];
		for (let i = 0; i < iterations; ++i) {
			times.push(await resize(outsize, buf));
		}
		const avgTime = times.reduce((acc, n) => acc + n, 0) / iterations;
		console.log(human(buf.length).padStart(8, " "), `${avgTime.toFixed(2)}ms`);
	}
})();

async function resize(size, buf) {
	const start = performance.now();
	await sharp(buf).resize(size, size).toBuffer();
	return performance.now() - start;
}

const K = 1024;
const M = K * K;
function human(n) {
	if (n < K) return `${n}`;
	if (n < M) return `${(n / K).toFixed(2)}K`;
	return `${(n / M).toFixed(2)}M`;
}
