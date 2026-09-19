---
title: "Memo"
subtitle: "Notes on Cloud, Security, and AI"
date: 09-18-2026
draft: false
---

My thoughts and experiences on the intersection of the world of Tech, AI, and my faith with God. I aim to share insights, lessons learned, and reflections on topics in Cloud computing, Security, and Artificial Intelligence. 

## Notes from 2026

### Least Privilege Is Never "Done"

Spent today going through IAM roles that had quietly accumulated wildcard permissions over the past few quarters. Every one of them made sense in isolation at the time it was granted, and none of them made sense together. Least privilege isn't a one-time hardening pass, it's a habit you have to keep re-earning as the environment drifts. The real fix wasn't more policy, it was scheduling the review itself so drift gets caught before it becomes the norm.
