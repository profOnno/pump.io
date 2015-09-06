# pump.io - branch: _image_access_

## About image_acces branch

I noticed that if i post a image to a list (Familiy or Custom) the title and description will be put on the stream of the member of the list. The member can't see the image because it has no access (403). The image (bin) is not posted to the feed but the link is in the ActivityObject.

After a while i figured out that the [lib/model/collection.js](https://github.com/profOnno/pump.io/blob/image_access/lib/model/collection.js) is responsable for the access. The function that is called to verify the authorizesation is Collection.isList(props,callback).

The props argument consists of 
```
 props:{
        id: "http://localhost:31337/api/collection/g1vEduJWTbe7DOgNFh_bDA",
        objectType: "collection"
    }
```

This will fail the test cause it's not complete. Using `ActivityObject.getObject("collection",props.id,this);` gets a props with author and the rest of the properies needed to get through the test.

I'm not sure if the fix is in the right place, maybe it should be in the [lib/objectmiddleware.js](https://github.com/profOnno/pump.io/blob/image_access/lib/objectmiddleware.js) there the `authorOrRecipient = function(req, res, next)` is called.
