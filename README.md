# Form Viewer

A Form Viewer app based on [Daniël Beeke](https://danielbeeke.nl)'s [rdf-form](https://github.com/danielbeeke/rdf-form).

This is a demonstrator for the [Solid basic form builder](https://github.com/SolidLabResearch/Challenges/issues/19) challenge:

- [x] Create a Form Builder web app to generate a Form Template
    - This is a sub challenge. See also:
      - https://github.com/SolidLabResearch/Challenges/issues/64
      - https://github.com/smessie/FormGenerator
- [x] Create a Form Viewer web app to that creates a simple web form using a Form Template
- [ ] Make Form Template support for standard SHACL or ShEx shape expressions
- [x] The Form Template should be available on a public URL and loaded into the 
  application at run time
- [x] Make the application to post data to an [LDP](https://www.w3.org/TR/ldp/) resource 
- [x] Make the application to post data to a [Solid](https://solidproject.org) pod
- [ ] Make the app store the provenance information of the results
- [x] The location of the [LDP](https://www.w3.org/TR/ldp/) resource may be provided via the Form Template or be set at run time
- [x] Create a Result Viewer app that displays the results in a nice format (using the provenance information)
    - See https://github.com/phochste/CVViewer for an example app
- [x] Use [OpenURL](https://en.wikipedia.org/wiki/OpenURL) as URL specification

The Form Viewer can create a Web Form when a template URL is provided. 

# Demonstrator 

## The Form Template

https://formviewer.patrickhochstenbach.net/book-review.form.ttl

## The Form Viewer App

https://formviewer.patrickhochstenbach.net?rft.form=https://formviewer.patrickhochstenbach.net/book-review.form.ttl

 - Fill out a Web profile as actor and target
 - Fill out a URL as subject
 - Type any text in content 
 - Send will post the data to a http container at https://httpbin.org

## Usage

```
https://formviewer.patrickhochstenbach.net/?PARAMS

Where PARAMS :
 
  ctx_ver=Z39.88-2004             (optional protocol version)
  rft_val_fmt=http://formviewer.patrickhochstenbach.net (optional parameter definition)
  rft.form=FORM-TTL-URL 
  rft.data=DATA-TEMPLATE-TTL-URL  (optional)
  rft.hydra=HYDRA-TTL-URL         (optional)

E.g.

https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net/book-review.form.ttl&rft.data=https://formviewer.patrickhochstenbach.net/book-review.ttl
```

The hydra-ttl-url is a Turtle resource to provide information where the form results should
be submitted. An example:

```
@prefix hydra: <http://www.w3.org/ns/hydra/core#> .

[]  hydra:endpoint <https://hochstenbach.inrupt.net/inbox> ;
   hydra:supportedClass [
       a hydra:Class ;
       hydra:method "POST"
   ] .
```

Hydra parameters:

- _hydra:endpoint_ : the web resource to send the RDF output to
- _hydra:method_ : the HTTP verb to use
- _hydra:next_ : (optional) the web resource to load after a successful RDF submission

## Rationale

This app provides a demonstration for decentralized form handling: how to define a form, what data to put in the form, where the form needs to be stored is decoupled. Even the application you use to render the form and submit the results is decoupled from a specific server/website implementation.

- Alice could publish a book review form on her website
- Bob could use a FormViewer application to post book review resources to his own Solid Pod
- Bob could invite Charly to edit the resource
- Charly could use his own FormViewer to update Bob's book review with Alice's form definition
- Charly could submit the results also to his own Solid Pod by creating a hydra resource

# More examples

- [Peer Review Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://hochstenbach.inrupt.net/public/dev/form/report.form.ttl&rft.data=https://formviewer.patrickhochstenbach.net/artifact1.ttl)
- [Book Review Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net/book-review.form.ttl)
- [WYSIWIG Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net/wysiwyg.form.ttl)
- [Recipe Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net/recipe.form.ttl)
- [Confirm Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net/confirm.form.ttl)
- [Bibliography Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net/journalArticle.form.ttl)
- [Doodle Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net/doodle.form.ttl&rft.data=https://bellow2.ugent.be/test/dev/form/doodle.ttl)
- [Todo Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net//todo.form.ttl&rft.data=https://hochstenbach.inrupt.net/public/dev/form/todo.ttl)
- [CV Form](https://formviewer.patrickhochstenbach.net/?rft.form=https://formviewer.patrickhochstenbach.net/cv.form.ttl)
