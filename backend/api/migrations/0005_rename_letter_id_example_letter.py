# Generated by Django 5.1.6 on 2025-03-06 18:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_letters_example'),
    ]

    operations = [
        migrations.RenameField(
            model_name='example',
            old_name='letter_id',
            new_name='letter',
        ),
    ]
