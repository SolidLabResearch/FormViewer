# Form Viewer

A Form Viewer app based on **Daniel Beeke's** [rdf-form](https://github.com/danielbeeke/rdf-form).

This is a demonstrator for the [Solid basic form builder](https://github.com/SolidLabResearch/Challenges/issues/19) challenge:

- [ ] Create a Form Builder web app to generate a Form Template
- [x] Create a Form Viewer web app to that creates a simple web form using a Form Template
- [x] The Form Template should be available on a public URL and loaded into the 
  application at run time
- [x] Make the application to post data to an [LDP](https://www.w3.org/TR/ldp/) resource 
- [ ] Make the app store the provenance information of the results
- [x] The location of the [LDP](https://www.w3.org/TR/ldp/) resource may be provided via the Form Template or be set at run time
- [ ] Create a Result Viewer app that displays the results in a nice format (using the provenance information)

The Form Viewer can create a Web Form when a template URL is provided. 

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

## Usage

```
https://bellow2.ugent.be/test/dev/#FORM-TTL-URL (+ #DATA-TEMPLATE-TTL-URL)

E.g.

https://bellow2.ugent.be/test/dev/form-viewer/#https://bellow2.ugent.be/test/dev/form/book-review.form.ttl#https://bellow2.ugent.be/test/dev/form/book-review.ttl
```

# More examples

- [Peer Review Form](https://bellow2.ugent.be/test/dev/form-viewer/#https://hochstenbach.inrupt.net/public/dev/form/report.form.ttl#https://bellow2.ugent.be/test/dev/form/artifact1.ttl)
- [Book Review Form](https://bellow2.ugent.be/test/dev/form-viewer/#https://bellow2.ugent.be/test/dev/form/book-review.form.ttl)
- [WYSIWIG Form](https://bellow2.ugent.be/test/dev/form-viewer/#https://bellow2.ugent.be/test/dev/form/wysiwyg.form.ttl)
- [Recipe Form](https://bellow2.ugent.be/test/dev/form-viewer/#https://bellow2.ugent.be/test/dev/form/recipe.form.ttl)
- [Confirm Form](https://bellow2.ugent.be/test/dev/form-viewer/#https://bellow2.ugent.be/test/dev/form/confirm.form.ttl)
- [Bibliography Form](https://bellow2.ugent.be/test/dev/form-viewer/#https://bellow2.ugent.be/test/dev/form/journalArticle.form.ttl)