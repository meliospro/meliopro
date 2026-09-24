# Proguard rules for SamaTaxi Android app
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclassmembers class com.samataxi.kaolack.** {
    *;
}
-dontwarn androidx.webkit.**
