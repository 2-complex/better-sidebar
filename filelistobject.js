
jsonSidebarObject = {
    root: {
        name: "root",
        children: [
            {
                name: "MyDrive",
                children: [
                    { name: "mySubdirectory1", children: [
                        { name: "A.xtx", children: [] },
                        { name: "B.xtx", children: [] },
                    ] },
                    { name: "myFile1", children: [] },
                    { name: "myFile2", children: [] },
                    { name: "myFile11", children: [] },
                    { name: "myFile12", children: [] },
                ] ,
            } ,
            {
                name: "MyDrive2",
                children: [
                    { name: "myOtherFile1", children: [] },
                    { name: "myOtherFile2", children: [] },
                    { name: "myOtherFile11", children: [] },
                    { name: "myOtherFile12", children: [] },
                ] ,
            } ,
        ] ,
    } ,

    ls: function (path, cursor)
    {
        cursor = cursor || this.root;

        while( path != '' )
        {
            var newCursor = {children: []};
            var name = path.split('/').slice(-1);

            for( var i = 0; i < cursor.children.length; i++ )
            {
                if( cursor.children[i].name == name )
                {
                    newCursor = cursor.children[i];
                    break;
                }
            }

            path = path.split('/').slice(1).join('/'),
            cursor = newCursor;
        }

        return cursor.children;
    } ,
};

