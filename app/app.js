'use strict';

const bobbin = angular.module('BobbinApp', [
  'ui.materialize',
  'ui.router',
  'ui.router.state.events',
  'wu.masonry',
  'ngFileUpload'
])

// If minifying code need to wrap dependencies and function in array
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  //page doesn't exist, back to root; homepage is login
  $urlRouterProvider.otherwise('/');

  //state SPA not pages
  $stateProvider
  .state('root', {
    url: '/',
    templateUrl: 'app/templates/pages/home.html'
  })

  // .state('login', {
  //   url: '/login',
  //   views: {
  //     'login': {
  //       template: '<login-component></login-component>'
  //     }
  //   }
  // })

  //parent state
  //abstract true is a placeholder abstract state, dooes not render.
  .state('projects', {
    abstract: true,
    templateUrl: 'app/templates/pages/projects.html'
  })

  //child state
  .state('projects.items', {
    url: '/projects',
    views: {
      'projects': {
        component: 'projectsComponent'
      }
    },
    data: { requireAuth: true }
  })

  .state('projects.detail', {
    url: '/projects/:projectId',
    views: {
      'projectsDetail': {
        component: 'projectDetailComponent'
      }
    },
    data: { requireAuth: true }
  })

  .state('editProject', {
    abstract: true,
    templateUrl: 'app/templates/pages/project-edit.html',
  })

  .state('editProject.view', {
    url: '/projects/:projectId/edit',
    views: {
      'editProject': {
        component: 'editProjectComponent'
      }
    },
    data: { requireAuth: true }
  })

  .state('profile', {
    abstract: true,
    templateUrl: 'app/templates/pages/profile-view.html',
  })

  .state('profile.view', {
    url: '/profile',
    views: {
      'profile': {
        component: 'profileViewComponent'
      }
    },
    data: { requireAuth: true }
  });
}])

.run(function($rootScope, $state, FBCreds, authFactory) {
  let creds = FBCreds;
  let authConfig = {
    apiKey: creds.apiKey,
    authDomain: creds.authDomain,
    databaseURL: creds.databaseURL
  };

  firebase.initializeApp(authConfig);

  // On every state change, check if auth is required
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.requireAuth) {
      authFactory.isAuthenticated()
        .then((userExists) => {
          if (userExists) {
            // If current state is root, send user to projects
            // console.log('User is authenticated; proceed.');
            if ($state.current.name === 'root') {
              $state.go('projects.items');
            }
          } else {
            // If user is not authed, send them to login state
            $state.go('root');
            return;
          }
        });
    }
  });
});
