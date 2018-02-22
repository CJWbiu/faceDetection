<?php
  $snapData = $_POST['base'];
  $snapData = str_replace(' ','+',$snapData);
  // $snapData = str_replace(' ', '+', $snapData);
  $img = base64_decode($snapData);
  $file='upload/'.uniqid().'.png';
  // chmod('photo', 755);
  if (!(file_put_contents($file, $img))) {
   	echo json_encode(array('code' => 500, 'msg' => '文件上传失败'));
  } else {
    echo json_encode(array('code' => 200, 'msg' => '文件上传成功', 'path' => $file));
  }
?>