from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

from .validators import validate_icon_image_size, validate_image_file_extension


def category_icon_upload_path(instance, filename):
    return f"category/{instance.id}/category_icon/{filename}"


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.FileField(
        upload_to=category_icon_upload_path,
        null=True,
        blank=True,
        validators=[validate_icon_image_size, validate_image_file_extension],
    )

    def save(self, *args, **kwargs):
        # Filefield doesn't automatically delete a old file when updating
        # with a new one, so here we manually do so.
        # self.id is True when instance already exists and we're updating it.
        if self.id:
            existing = get_object_or_404(Category, id=self.id)
            if existing.icon != self.icon:
                existing.icon.delete(save=False)

        self.name = self.name.lower()
        super(Category, self).save(*args, **kwargs)

    @receiver(models.signals.pre_delete, sender="server.Category")
    def category_delete_files(sender, instance, **kwargs):
        icon_file = instance.icon
        if icon_file:
            icon_file.delete(save=False)

    def __str__(self):
        return self.name


def server_icon_upload_path(instance, filename):
    return f"server/{instance.id}/server_icon/{filename}"


def server_banner_upload_path(instance, filename):
    return f"server/{instance.id}/server_banner/{filename}"


class Server(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="server_owner",
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="server_category"
    )
    description = models.CharField(max_length=250, blank=True, null=True)
    member = models.ManyToManyField(settings.AUTH_USER_MODEL)
    banner = models.ImageField(
        upload_to=server_banner_upload_path,
        null=True,
        blank=True,
        validators=[validate_image_file_extension],
    )
    icon = models.ImageField(
        upload_to=server_icon_upload_path,
        null=True,
        blank=True,
        validators=[validate_icon_image_size, validate_image_file_extension],
    )

    def save(self, *args, **kwargs):
        if self.id:
            existing = get_object_or_404(Server, id=self.id)
            if existing.icon != self.icon:
                existing.icon.delete(save=False)
            if existing.banner != self.banner:
                existing.banner.delete(save=False)

        super(Server, self).save(*args, **kwargs)

    @receiver(models.signals.pre_delete, sender="server.server")
    def server_delete_files(sender, instance, **kwargs):
        icon_file = instance.icon
        banner_file = instance.banner

        if icon_file:
            icon_file.delete(save=False)
        if banner_file:
            banner_file.delete(save=False)

    def __str__(self):
        return self.name


class Channel(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="channel_owner",
    )
    topic = models.CharField(max_length=100)
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name="channel_server"
    )

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super(Channel, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
