#!/bin/bash

sizes=(16 32 48 256)

for size in ${sizes[@]}; do
	inkscape -z -e 2048-qt_${size}x${size}.png -w $size -h $size scalable/apps/2048-qt.svg
	mkdir -p ${size}x${size}/apps
	mv 2048-qt_${size}x${size}.png ${size}x${size}/apps/2048-qt.png
done
