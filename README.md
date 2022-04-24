# Solid Form Viewer

A Solid Form Viewer app based on [rdf-form](https://github.com/danielbeeke/rdf-form).

This is a demonstrator for the [Solid basic form builder](https://github.com/SolidLabResearch/Challenges/issues/19) challenge:

- [ ] Create a Form Builder web app to generate a Form Template
- [x] Create a Form Viewer web app to that creates a simple web form using a Form Template
- [x] The Form Template should be available on a public URL and loaded into the 
  application at run time
- [x] Make the application to post data to a Solid pod container
- [ ] Make the app store the provenance information of the results
- [x] The location of the Solid pod container may be provided via the Form Template or be set at run time
- [ ] Create a Result Viewer app that displays the results in a nice format (using the provenance information)

The Solid Form Viewer can create a Web Form when a template URL is provided. 

# Demonstrator 

## The Form Template

https://bellow2.ugent.be/test/dev/form/book-review.form.ttl

## The Form Viewer App

https://bellow2.ugent.be/test/dev/form-viewer/#https://bellow2.ugent.be/test/dev/form/book-review.form.ttl

 - Fill out a Web profile as actor and target
 - Fill out a URL as subject
 - Type any text in content
 - Send will post the data to my inbox

## The Results

https://bellow2.ugent.be/test/dev/form/inbox/
