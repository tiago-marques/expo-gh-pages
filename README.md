# expo-gh-pages
Hosting An App from Expo on Github Pages.

## Why?
We use Github Pages to serve Expo projects to our customers can see all the progress of they application development.

## Configure

### Complete your package JSON with
* homepage
* script to run expo-gh-pages
```
{
    ...
    "homepage": "",
    "scripts": {
        ...
        "deploy": "expo-gh-pages",
        ...
    },
    ...
}
```

### Host Expo projects in Github Pages!
![Website example](doc/example.png)
