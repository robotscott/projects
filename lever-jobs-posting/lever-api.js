var $f = $j = jQuery.noConflict();

var jobListing = {

  // Variables
  companyName: '', // Companies Lever user name
  careerContainer: '#careers-api', // container to append postings onto
  listPageInfo: { // variables to set what information to include on job list
    date: true,
    location: true,
    team: false,
    department: false,
    commitment: false, // eg part-time, full-time, etc.
    shortDescription: true,
    fullDescription: false,
    learnMore: true,
    applyNow: false
  },
  initialOrder: 'AtoZ', // AtoZ, ZtoA, Newest, or Oldest
  userSortOptions: false, // set to true to add sort option
  filterOptions: undefined, // location, commitment, team, and/or department (seperate with commas; undifined/false will show no filter options)
  onDetailsPageLoad: undefined, // optional callback for after details page has loaded
  onListPageLoad: undefined, // optional callback for after list page has loaded
  
  // Call job listings for career pages
  callListings: function() {
    var pageUrl = window.location.href;
    var lever_uri = 'https://api.lever.co/v0/postings/';
    var url;
    var success;

    // Variables for job details page
    if (pageUrl.indexOf('?post-id=') >= 0) {
      var postID = pageUrl.split('?post-id=')[1];
      url = lever_uri+this.companyName+'/'+postID;
      success = jobListing.detailPage;
    }
    // Variables for jobs list page
    else {
      url = lever_uri+this.companyName+'?mode=json';
      success = jobListing.listPage;
    }

    $f.ajax({
      dataType: "json",
      url: url,
      success: function(data){
        success(data);
      },
      error: function(errorThrown) {
        console.log(errorThrown);
      }
    });

  },

  // Builds details page
  detailPage: function(data) {
    var posting = jobListing.leverPostingInfo(data);

    $f(jobListing.careerContainer).append(
      '<h3 class="job-title">'+posting.title+'</h3>' +
      '<div class="tags">' +
      jobListing.htmlTags(posting.location, posting.team, posting.department, posting.commitment) +
      '</div>' +
      '<p class="posted">Posted: '+posting.formattedDate+'</p>'+
      '<div class="description">'+posting.description+'</div>' +
      '<a class="primary-button" href="'+posting.applyLink+'" target="_blank">Apply Now</a>'
    );

    if (this.onDetailsPageLoad) {
      this.onDetailsPageLoad();
    }

  },

  // Builds list page
  listPage: function(data) {

    // Checks for filter options
    if (jobListing.filterOptions) {
      // Build filters
      jobListing.filters(data, jobListing.filterOptions);
      // Add filter event handler
      $f('.job-filter').click(function(e){
        e.preventDefault();
        jobListing.activateFilter(this);
      });
      // Add clear filters button event handler
      $f('.clear-filters a').click(function(e){
        e.preventDefault();
        jobListing.clearFilters();
      });
    }

    // Set initial sort order of jobs list
    jobListing.sort.sortJobs(
      jobListing.initialOrder,
      data,
      'text',
      'createdAt'
    );

    // Check user sort options
    if (jobListing.userSortOptions) {
      // Build sort options selector
      $f(jobListing.careerContainer).append(
        '<div class="sorting-section">' +
        '<form>' +
        '<label for="sortby">Sort By:</label>' +
        '<select name="sortby">'+
        '<option value="AtoZ">A to Z</option>' +
        '<option value="ZtoA">Z to A</option>' +
        '<option value="Newest">Newest</option>' +
        '<option value="Oldest">Oldest</option>' +
        '</select>' +
        '</form>' +
        '</div>'
      );
      // Set sort options selector value to match initial sort order
      $f('.sorting-section select').val(jobListing.initialOrder);
      // Add sort options selector change event handler
      $f('.sorting-section select').change(function() {
        jobListing.sort.sortJobs(
          $f('.sorting-section select').val(),
          $f('.jobs-list').find('.job'),
          'dataset.title', 'dataset.timestamp'
        ).appendTo($f('.jobs-list'));
      });
    }

    // Build list
    $f(jobListing.careerContainer).append('<div class="jobs-list content-list"></div>');
    for (i = 0; i < data.length; i++) {
      var posting = jobListing.leverPostingInfo(data[i]);

      $f(jobListing.careerContainer).find('.jobs-list').append(
        '<div class="job content-item" '+dataTags()+'>' +
        '<h3 class="job-title">'+posting.title+'</h3>' +
        jobListing.listInfo(posting) +
        '</div>'
      );
    }

    if (jobListing.onListPageLoad) {
      jobListing.onListPageLoad();
    }

    // Defines data tags for each job
    function dataTags() {
      var dataTagString = 'data-title="'+posting.title+'" data-timestamp="'+posting.timestamp+'" ';
      if (posting.location !== 'Uncategorized'){dataTagString += 'data-location="'+posting.locationCleanString+'" ';}
      if (posting.commitment !== 'Uncategorized'){dataTagString += 'data-commitment="'+posting.commitmentCleanString+'" ';}
      if (posting.team !== 'Uncategorized'){dataTagString += 'data-team="'+posting.teamCleanString+'" ';}
      if (posting.department !== 'Uncategorized'){dataTagString += 'data-department="'+posting.departmentCleanString+'" ';}
      return dataTagString;
    }
  },

  // Create object containing info about a Lever posting
  leverPostingInfo: function(data) {
    var postingObject = {
      title: data.text,
      description: data.description,
      //Making each job description shorter than 250 characters
      shortDescription: jobListing.closeOpenTags($f.trim(data.description).substring(0, 250).replace('\n', ' ') + "..."),
      location: jobListing.nullCheck(data.categories.location),
      locationCleanString: jobListing.cleanString(data.categories.location),
      commitment: jobListing.nullCheck(data.categories.commitment),
      commitmentCleanString: jobListing.cleanString(data.categories.commitment),
      team: jobListing.nullCheck(data.categories.team),
      teamCleanString: jobListing.cleanString(data.categories.team),
      department: jobListing.nullCheck(data.categories.department),
      departmentCleanString: jobListing.cleanString(data.categories.department),
      applyLink: data.applyUrl,
      timestamp: data.createdAt,
      formattedDate: jobListing.formatDate(new Date(data.createdAt)),
      detailsLink: 'careers-details.html?post-id='+data.id
    };
    return postingObject;
  },

  // Defines HTML data tags for display
  htmlTags: function(location, team, department, commitment) {
    var htmlTagString = '';
    if (location !== 'Uncategorized'){htmlTagString += '<div class="location"><span class="label">Location:</span> <span class="value">'+location+'</span></div>';}
    if (team !== 'Uncategorized'){htmlTagString += '<div class="team"><span class="label">Team:</span> <span class="value">'+team+'</span></div>';}
    if (department !== 'Uncategorized'){htmlTagString += '<div class="department"><span class="label">Department:</span> <span class="value">'+department+'</span></div>';}
    if (commitment !== 'Uncategorized'){htmlTagString += '<div class="commitment"><span class="label">Commitment:</span> <span class="value">'+commitment+'</span></div>';}
    return htmlTagString;
  },

  // Defines HTML data tags for display
  listInfo: function(posting) {
    var htmlInfoString = '';
    if(this.listPageInfo.date === true){
      htmlInfoString += '<div class="date info-tag"><span class="label">Posted: </span><span class="value">'+posting.formattedDate+'</span></div>';
    }
    if(this.listPageInfo.location === true){
      if(posting.location !== 'Uncategorized') {
        htmlInfoString += '<div class="location info-tag"><span class="label">Location: </span><span class="value">'+posting.location+'</span></div>';
      } else {
        htmlInfoString += '<div class="location info-tag"></div>';
      }
    }
    if(this.listPageInfo.team === true){
      if(posting.team !== 'Uncategorized') {
        htmlInfoString += '<div class="team info-tag"><span class="label">Team: </span><span class="value">'+posting.team+'</span></div>';
      } else {
        htmlInfoString += '<div class="team info-tag"></div>';
      }
    }
    if(this.listPageInfo.department === true){
      if(posting.department !== 'Uncategorized') {
        htmlInfoString += '<div class="department info-tag"><span class="label">Department: </span><span class="value">'+posting.department+'</span></div>';
      } else {
        htmlInfoString += '<div class="department info-tag"></div>';
      }
    }
    if(this.listPageInfo.commitment === true){
      if(posting.commitment !== 'Uncategorized') {
        htmlInfoString += '<div class="commitment info-tag"><span class="label">Commitment: </span><span class="value">'+posting.commitment+'</span></div>';
      } else {
        htmlInfoString += '<div class="commitment info-tag"></div>';
      }
    }
    if(this.listPageInfo.shortDescription === true){
      htmlInfoString += '<div class="description short">'+posting.shortDescription+'</div>';
      console.log(posting);
    }
    if(this.listPageInfo.fullDescription === true){
      htmlInfoString += '<div class="description">'+posting.description+'</div>';
    }
    if(this.listPageInfo.learnMore === true){
      htmlInfoString += '<div class="primary-button learn-more"><a href="'+posting.detailsLink+'">Learn more</a></div>';
    }
    if(this.listPageInfo.applyNow === true){
      htmlInfoString += '<div class="primary-button apply-now"><a href="'+posting.applyLink+'" target="_blank">Apply Now</a></div>';
    }
    return htmlInfoString;
  },

  // Function that builds filters
  filters: function(data, categories) {
    $f(jobListing.careerContainer).append('<div class="filters-section"></div>');

    // Get array of set filter categories
    categories = categories.split(',').map(function(category){
      return category.replace(' ','');
    });

    // Build category section for each filter category
    for(i = 0; i < categories.length; i++) {
      // Find all unique corresponding values from job list
      var filters = data
        .filter(getValues)
        .map(getValues)
        .filter(uniqueValue)
        .sort();
      // Add section for filter category
      $f('.filters-section').append('<div class="filter-category" data-filtercategory="'+categories[i]+'"><h3>'+toTitleCase(categories[i])+'</h3></div>');
      // Add a filter button for each unique values
      for(j = 0; j < filters.length; j++) {
        var filterCleanString = jobListing.cleanString(filters[j]);
        $f('.filter-category[data-filtercategory="'+categories[i]+'"]').append(
          '<a href="#" class="job-filter" data-filter="'+filterCleanString+'">'+filters[j]+'</a>'
        );
      }
    }

    // Add clear all filters button
    $f('.filters-section').append('<div class="clear-filters secondary-button"><a href="#">Clear All Filters</a></div><div class="results-message"></div>');

    // Fliters helper functions
    function getValues(posting) {
      if (posting.categories[categories[i]] !== "undefined") {
        return posting.categories[categories[i]];
      }
    }
    function uniqueValue(itm, i, a) {
      return i == a.indexOf(itm);
    }
    function toTitleCase(str) {
      return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
      });
    }
  },

  // Function that handles filter event
  activateFilter: function(filter){

    // Get filter's category and value
    var filterCategory = this.getCategory(filter);
    var filterValue = filter.getAttribute('data-filter');

    // Define actions based on current filter state
    // There are active filters already
    if ($f('.jobs-list.filtered').length) {
      // This filter is active
      if (filter.hasClass('active')) {
        filter.removeClass('active');
        // There are other active filters
        if ($f('.job-filter.active').length) {
          this.matchFilters();
        }
        // There are no longer any active filters
        else {
          $f('.results-message').html('');
          $f('.jobs-list .job').removeClass('match');
          $f('.jobs-list').removeClass('filtered');
        }
      }
      // This filter is not active
      else {
        filter.addClass('active');
        $f('.jobs-list .jobs').removeClass('match');
        this.matchFilters();
      }
    }
    // There are no current active filters
    else {
      filter.addClass('active');
      $f('.jobs-list').addClass('filtered');
      this.matchFilters();
    }

  },

  // Helper functions for activateFilter
  // Match active filters
  matchFilters: function() {
    // Get all active filters
    var filterSets = this.categoriesWithActiveFilters();

    // Filter job list by active filters
    var jobs = Array.prototype.slice.call(document.querySelectorAll('.jobs-list .job'));
    $f(jobs).removeClass('match');
    filterSets.forEach(filterJobs);
    $f(jobs).addClass('match');

    // Change match count message
    var matchCount = $f('.job.match').length;
    var message = '';
    if (matchCount === 0) {
      message = '<p>There are no current jobs matching these criteria</p>';
    } else if (matchCount === 1) {
      message = '<p>There is 1 job matching these criteria</p>';
    } else {
      message = '<p>There are '+matchCount+' jobs matching these criteria</p>';
    }
    $f('.results-message').html(message);

    function filterJobs(filterSet) {
      jobs = jobs.filter(function(job){
        var match = false;
        filterSet.filters.forEach(function(filter){
          if(job.dataset[filterSet.category] === filter) {
            match = true;
          }
        });
        return match;
      });
    }

  },
  // Get array of categories with active filters and those filters
  categoriesWithActiveFilters: function() {
    var filterCategories = Array.prototype.slice.call(document.querySelectorAll('.filter-category'));
    var activeCategories = filterCategories
      .filter(function(c){return c.querySelector('.job-filter.active');})
      .map(jobListing.getCategoriesAndFilters);
    return activeCategories;
  },
  // 
  getCategoriesAndFilters: function(category) {
    var c = category.getAttribute('data-filtercategory');
    var f = Array.prototype.slice.call(category.querySelectorAll('.job-filter.active'))
      .map(function(filter){
        return filter.getAttribute('data-filter');
      });
    var categoryAndFilters = {
      category: c,
      filters: f
    };
    return categoryAndFilters;
  },
  // Gets filter's category
  getCategory: function(filter) {
    var el = filter;
    while((el = el.parentElement) && !el.classList.contains('filter-category'));
    return el.getAttribute('data-filtercategory');
  },

  // Clears all active filters
  clearFilters: function() {
    $f('.results-message').html('');
    $f('.job-filter.active').removeClass('active');
    $f('.jobs-list .job').removeClass('match');
    $f('.jobs-list').removeClass('filtered');
  },

  // Functions that sort jobs list
  sort: {
    sortJobs: function(sortBy, list, alphebeticalProp, dateProp) {
      if (sortBy === 'AtoZ') {
        return list.sort(jobListing.sort.AtoZ(alphebeticalProp));
      } else if (sortBy === 'ZtoA') {
        return list.sort(jobListing.sort.ZtoA(alphebeticalProp));
      } else if (sortBy === 'Newest') {
        return list.sort(jobListing.sort.newest(dateProp));
      } else if (sortBy === 'Oldest') {
        return list.sort(jobListing.sort.oldest(dateProp));
      }
    },
    AtoZ: function(prop){
      return function(a,b) {
        a = jobListing.sort.resolvePropertyString(a, prop);
        b = jobListing.sort.resolvePropertyString(b, prop);
        if (a.toLowerCase() < b.toLowerCase())
          return -1;
        if (a.toLowerCase() > b.toLowerCase())
          return 1;
        return 0;
      };
    },
    ZtoA: function(prop){
      return function(a,b) {
        a = jobListing.sort.resolvePropertyString(a, prop);
        b = jobListing.sort.resolvePropertyString(b, prop);
        if (a.toLowerCase() > b.toLowerCase())
          return -1;
        if (a.toLowerCase() < b.toLowerCase())
          return 1;
        return 0;
      };
    },
    newest: function(prop){
      return function(a,b) {
        a = jobListing.sort.resolvePropertyString(a, prop);
        b = jobListing.sort.resolvePropertyString(b, prop);
        return b - a;
      };
    },
    oldest: function(prop){
      return function(a,b) {
        a = jobListing.sort.resolvePropertyString(a, prop);
        b = jobListing.sort.resolvePropertyString(b, prop);
        return a - b;
      };
    },
    resolvePropertyString: function(obj, path) {
      path = path.split('.');
      var current = obj;
      while(path.length) {
          if(typeof current !== 'object') return undefined;
          current = current[path.shift()];
      }
      return current;
    }
  },


  // Misc helper functions

  //Functions for checking if the variable is unspecified
  cleanString: function(string) {
    if (string) {
      var cleanString = string.replace(/\s+|,+/ig, "").toLowerCase();
      return cleanString;
    }
    else {
      return "Uncategorized";
    }
  },
  closeOpenTags: function(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.innerHTML;
  },
  nullCheck: function(string) {
    if (!string) {
      var result = 'Uncategorized';
      return result;
    }
    else {
      return string;
    }
  },

  formatDate: function(date) {
    return date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear();
  },



  // Unused function for potential future use
  // sorceTracking: function() {
  //   //Checking for potential Lever source or origin parameters
  //   var leverParameter = '';
  //   var trackingPrefix = '?lever-'


  //   if ( pageUrl.indexOf(trackingPrefix) >= 0){
  //     // Found Lever parameter
  //     var pageUrlSplit = pageUrl.split(trackingPrefix);
  //     leverParameter = '?lever-'+pageUrlSplit[1];
  //   }
  // },

};