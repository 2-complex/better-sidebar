
jsonSidebarObject = {
    root: {
        name: "root",
        children: [
            {
                name: "MyDrive",
                children: [
                    { name: "jeff", children: [
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

    findChild: function( cursor, name )
    {
        var child = {children: []};

        for( var i = 0; i < cursor.children.length; i++ )
        {
            if( cursor.children[i].name == name )
            {
                return cursor.children[i];
            }
        }
    } ,

    ls: function( path )
    {
        cursor = this.root;

        while( path != '' )
        {
            cursor = this.findChild( cursor, path.split('/')[0] );
            path = path.split('/').slice(1).join('/');
        }

        return cursor.children;
    } ,
};

