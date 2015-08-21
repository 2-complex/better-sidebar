
jsonSidebarObject = {
    root: {
        name: "root",
        children: [
            {
                name: "MyDrive",
                children: [
                    { name: "myFile1", children: [] },
                    { name: "myFile2", children: [] },
                    { name: "myFile3", children: [] },
                    { name: "myFile4", children: [] },
                ] ,
            } ,
            {
                name: "MyDrive2",
                children: [
                    { name: "myOtherFile1", children: [] },
                    { name: "myOtherFile2", children: [] },
                    { name: "myOtherFile3", children: [] },
                    { name: "myOtherFile4", children: [] },
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

