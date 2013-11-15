<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script src="js/jquery/jquery.js" ></script>
</head>
<body>

<script>
    if ( window.self === window.top ) {
//        not in a frame
        alert('not in a frame');
    } else {
//        in a frame
        <?php if(isset($_GET['idDialog'])) :?>
            <?php if(isset($_GET['post_id'])) :?>
                window.parent.$('<?= $_GET['idDialog'] ?> iframe')
                    .trigger('TD:iframe', {status    : 'posted',
                                           fb_answer : {post_id : '<?= $_GET['post_id']?>'}
                                          });
            <?php else : ?>
                window.parent.$('<?= $_GET['idDialog'] ?> iframe').trigger('FBShareDialog:iframe', {status: 'canceled'});
            <?php endif; ?>
        <?php else : ?>
            alert('Missing incoming data');
        <?php endif; ?>
    }

</script>

</body>
</html>