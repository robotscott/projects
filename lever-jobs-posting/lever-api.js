var jobListing = {

  // Variables
  companyName: 'kasasa', // Companies Lever user name
  initialOrder: 'AtoZ', // AtoZ, ZtoA, newest, or oldest
  userSortOptions: false, // set to true to add sort option
  filterOptions: undefined, // location, commitment, team, and/or department (seperate with commas; undifined/false will show no filter options)
  onDetailsPageLoad: undefined, // optional callback for after details page has loaded
  onListPageLoad: undefined, // optional callback for after list page has loaded
  
  // Call job listings for career pages
  callListings: function() {
    var pageUrl = window.location.href;
    var url;
    var success;

    // Variables for job details page
    if (pageUrl.indexOf('?post-id=') >= 0) {
      var postID = pageUrl.split('?post-id=')[1];
      url = 'https://api.lever.co/v0/postings/'+this.companyName+'/'+postID;
      success = jobListing.detailPage;
    }
    // Variables for jobs list page
    else {
      url = 'https://api.lever.co/v0/postings/'+this.companyName+'?mode=json';
      success = jobListing.listPage;
    }

    $f.ajax({
      datacommitment: "json",
      url: url,
      success: function(data){
        success(data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });

  },

  // Builds details page
  detailPage: function(_data) {
    var posting = _data;
    var title = posting.text;
    var description = posting.description;
    var location = jobListing.nullCheck(posting.categories.location);
    var locationCleanString = jobListing.cleanString(location);
    var commitment = jobListing.nullCheck(posting.categories.commitment);
    var commitmentCleanString = jobListing.cleanString(commitment);
    var team = jobListing.nullCheck(posting.categories.team);
    var teamCleanString = jobListing.cleanString(team);
    var department = jobListing.nullCheck(posting.categories.department);
    var link = posting.applyUrl;
    var timestamp = posting.createdAt;
    var dateString = new Date(timestamp);
    var formattedDate = jobListing.formatDate(dateString);

    $f('#careers').append(
      '<h3 class="job-title">'+title+'</h3>' +
      '<div class="tags">' +
      jobListing.htmlTags(location, team, department, commitment) +
      '</div>' +
      '<p class="posted">Posted: '+formattedDate+'</p>'+
      '<div class="description">'+description+'</div>' +
      '<a class="primary-button" href="'+link+'" target="_blank">Apply Now</a>'
    );

    if (this.onDetailsPageLoad) {
      this.onDetailsPageLoad();
    }

  },

  // Builds list page
  listPage: function(_data) {

    // Checks for filter options
    if (jobListing.filterOptions) {
      // Build filters
      jobListing.filters(_data, jobListing.filterOptions);
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
      _data,
      'text',
      'createdAt'
    );

    // Check user sort options
    if (jobListing.userSortOptions) {
      // Build sort options selector
      $f('#careers').append(
        '<div class="sorting-section">' +
        '<form>' +
        '<label for="sortby">Sort By:</label>' +
        '<select name="sortby">'+
        '<option value="AtoZ">A to Z</option>' +
        '<option value="ZtoA">Z to A</option>' +
        '<option value="newest">newest</option>' +
        '<option value="oldest">oldest</option>' +
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
    $f('#careers').append('<div class="jobs-list content-list"></div>');
    for (i = 0; i < _data.length; i++) {
      var posting = _data[i];
      var title = posting.text;
      var description = posting.descriptionPlain;
      //Making each job description shorter than 250 characters
      var shortDescription = $f.trim(description).substring(0, 250)
      .replace('\n', ' ') + "...";
      var location = jobListing.nullCheck(posting.categories.location);
      var locationCleanString = jobListing.cleanString(location);
      var commitment = jobListing.nullCheck(posting.categories.commitment);
      var commitmentCleanString = jobListing.cleanString(commitment);
      var team = jobListing.nullCheck(posting.categories.team);
      var teamCleanString = jobListing.cleanString(team);
      var department = jobListing.nullCheck(posting.categories.department);
      var departmentCleanString = jobListing.cleanString(department);
      var timestamp = posting.createdAt;
      var dateString = new Date(timestamp);
      var formattedDate = jobListing.formatDate(dateString);
      var link = 'careers-details.html?post-id='+posting.id;

      $f('#careers .jobs-list').append(
        // '<div class="job content-item '+teamCleanString+' '+locationCleanString+' '+commitmentCleanString+'" '+dataTags()+'>' +
        '<div class="job content-item" '+dataTags()+'>' +
        '<h3 class="job-title">'+title+'</h3>' +
        '<div class="tags">' +
        jobListing.htmlTags(location, team, department, commitment) +
        '</div>' +
        '<p class="posted">Posted: '+formattedDate+'</p>'+
        '<p class="description">'+shortDescription+'</p>' +
        '<a class="primary-button" href="'+link+'">Learn more</a>' +
        '</div>'
      );
    }

    if (jobListing.onListPageLoad) {
      jobListing.onListPageLoad();
    }

    // Defines data tags for each job
    function dataTags() {
      var tagString = 'data-title="'+title+'" data-timestamp="'+timestamp+'" ';
      if (location !== 'Uncategorized'){tagString += 'data-location="'+locationCleanString+'" ';}
      if (commitment !== 'Uncategorized'){tagString += 'data-commitment="'+commitmentCleanString+'" ';}
      if (team !== 'Uncategorized'){tagString += 'data-team="'+teamCleanString+'" ';}
      if (department !== 'Uncategorized'){tagString += 'data-department="'+departmentCleanString+'" ';}
      return tagString;
    }
  },

  // Defines HTML data tags for display
  htmlTags: function(location, team, department, commitment) {
    var tagString = '';
    if (location !== 'Uncategorized'){tagString += '<div class="location"><span class="label">Location:</span> <span class="value">'+location+'</span></div>';}
    if (team !== 'Uncategorized'){tagString += '<div class="team"><span class="label">Team:</span> <span class="value">'+team+'</span></div>';}
    if (department !== 'Uncategorized'){tagString += '<div class="department"><span class="label">Department:</span> <span class="value">'+department+'</span></div>';}
    if (commitment !== 'Uncategorized'){tagString += '<div class="commitment"><span class="label">Commitment:</span> <span class="value">'+commitment+'</span></div>';}
    return tagString;
  },

  // Function that builds filters
  filters: function(data, categories) {
    $f('#careers').append('<div class="filters-section"></div>');

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
    $f('.filters-section').append('<div class="clear-filters"><a href="#">Clear All Filters</a></div><div class="results-message"></div>');

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
      } else if (sortBy === 'newest') {
        return list.sort(jobListing.sort.newest(dateProp));
      } else if (sortBy === 'oldest') {
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