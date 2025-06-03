# cleanup.rb
require 'fileutils'

upload_dir = File.expand_path('public/tmp', __dir__)
threshold = 60 * 3  # 3分（秒）

Dir.glob("#{upload_dir}/*").each do |file|
  if File.file?(file) && (Time.now - File.mtime(file) > threshold)
    FileUtils.rm_f(file)
    puts "削除: #{file}"
  end
end
