var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require('./models/comment.js');

var data = [{
        name: "Cloads Rest",
        image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tristique sodales quam sed feugiat. Suspendisse orci felis, consectetur non semper quis, pharetra nec quam. Cras condimentum commodo turpis, eget luctus magna euismod nec. In nec pharetra nisi. Ut lacinia odio nec ligula maximus congue. Aliquam auctor vehicula arcu sit amet luctus. Donec in ante at felis consectetur hendrerit. Morbi non lorem suscipit, dignissim sapien in, congue turpis. Ut vel lacus nec risus cursus dictum. Nullam ornare erat turpis. Nulla facilisi. Maecenas sit amet luctus metus. Ut vehicula leo sagittis nunc tristique molestie. Curabitur suscipit urna ac magna tincidunt, in dictum justo ultricies."
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tristique sodales quam sed feugiat. Suspendisse orci felis, consectetur non semper quis, pharetra nec quam. Cras condimentum commodo turpis, eget luctus magna euismod nec. In nec pharetra nisi. Ut lacinia odio nec ligula maximus congue. Aliquam auctor vehicula arcu sit amet luctus. Donec in ante at felis consectetur hendrerit. Morbi non lorem suscipit, dignissim sapien in, congue turpis. Ut vel lacus nec risus cursus dictum. Nullam ornare erat turpis. Nulla facilisi. Maecenas sit amet luctus metus. Ut vehicula leo sagittis nunc tristique molestie. Curabitur suscipit urna ac magna tincidunt, in dictum justo ultricies."
    },
    {
        name: "Canyon Floor",
        image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tristique sodales quam sed feugiat. Suspendisse orci felis, consectetur non semper quis, pharetra nec quam. Cras condimentum commodo turpis, eget luctus magna euismod nec. In nec pharetra nisi. Ut lacinia odio nec ligula maximus congue. Aliquam auctor vehicula arcu sit amet luctus. Donec in ante at felis consectetur hendrerit. Morbi non lorem suscipit, dignissim sapien in, congue turpis. Ut vel lacus nec risus cursus dictum. Nullam ornare erat turpis. Nulla facilisi. Maecenas sit amet luctus metus. Ut vehicula leo sagittis nunc tristique molestie. Curabitur suscipit urna ac magna tincidunt, in dictum justo ultricies."
    }
]

function seedDB() {
    //	Remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds");

        //	add a few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a campground");
                    //	create a comment
                    Comment.create({
                        text: "This place is great, but I wish there was internet!",
                        author: "Homer"
                    }, function(err,comment) {
                    	if (err) {
                    		console.log(err);
                    	} else {
                    		campground.comments.push(comment);
                    		campground.save();
                    		console.log("Created a comment");
                    	}
                    })
                };
            })
        })
    });
}


module.exports = seedDB;