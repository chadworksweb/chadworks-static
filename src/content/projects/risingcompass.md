---
title: ""
date: 2026-07-28
dek: "The Rising Compass is a data-driven website built by chadworks in 2026. It combines front end UI/UX mastery with complex backend database and admin functionality."
---

I built the Rising Compass because I wanted a way to prove that the lyrical content of popular music was heading in a negative direction. To do this I needed a visualization that was easy to understand and based on a controlled data set. I needed a way to gather that data, which required automation of the thinking and classification of the lyrics themselves. There are a few companies that score lyrics on simple positive/negative sentiment, but there is nothing that scores or reads lyrics to the depth required to assign a moral charge based on something as complex as the five charge tiers and the 201 point scale of the Rising Compass.

I built, at the core, an AI-driven calibrator that (legally) analyzes the lyrics of a song by running the lyrics through a rigorous process, which can be seen [here](https://risingcompass.net/methodology/), and then adds the song to a database with all of the data points generated through that pipeline. Some of those data points are: tier, score, song summary, and effects on the listener.

Once I built that, I added a daily automation. Every day, the Rising Compass scans the top 20 songs of Spotify (and now a few other charts) and assigns an aggregate charge for that day. I also did a historical backfill of the top 20 songs from The Hot 100 starting in 1960 all the way up to 2025. This dataset finally exposed the exact trajectory that I have been talking about for years: that the messages contained in popular music have been trending downwards.

The most challenging part of the initial build was getting the calibrator to score songs accurately. It took a few months to get it to the point where I didn't have to stop and talk with Claude about why it scored a song the way it did. Upon publishing this project, the calibrator is running version 3 because it evolved so much in those first few months that it required versioning.

The website is live right now. There is an ocean of features to be explored and many more on the drawing board.

Rising Compass proves that chadworks can build a beautiful, modern and easy-to-use front end for a complicated, data driven backend, all for an entirely novel idea that no one has done yet.
