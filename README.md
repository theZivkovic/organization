# Organization

## Intro

This is a project for managing an organization. It contains a docker-compose that spins up:

* `organization-api`: for managing/viewing users/places/associations
* `mongodb`: storage for the organization-api
* `organization-seeder`: console app that seeds the mongodb

## Run / Test

To run the system: `docker-compose up`
To run the tests: `cd organization-api && npm run test`

After the containers are up, you can play around with API in `http/organization.http` file. You'll need a `Rest Client` extension for VSCode (extensionId: `humao.rest-clien`)

## Seeders

### places
Places are seeded from `organization-seeder/src/data/place-data.json`.
The results are entities in `organization` database, `places` collection. Alongside with `name`, `type`, each places has `left`/`right` numbers, which represent the entering/exiting index in a round-trip traversal of the tree (https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-nested-sets/). These numbers enable us to deep-search all descendants of a place node with a single query.

### users
A main manager is seeded  into collection `users`, so there is someone to create other users.

### associations
An association between main manager and main place (`Srbija`) is seeded into collection `associations`.

## File structure

`organization-api` is organized using Clean Architecture principles. 

* `src/core`: Core entities/enums and interfaces for managing them
* `src/application`: Depends only on core, contains use cases that API covers, like creating registration tokens, geting places by a user, adding associations etc.
* `src/infrastructure`: Depends on application and core, contains repository implementations
* `src/presentation`: Depends on all mentioned above, contains controllers

## Wish I've implemented

* request validation
* more tests: I only covered tests for a most complicated case, adding a user to a place
